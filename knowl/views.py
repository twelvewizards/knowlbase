from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Group
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.serializers.json import DjangoJSONEncoder
import json
from .models import Article

def index(request):
    # Fetch all articles and their related categories
    articles = list(Article.objects.values(
        'title', 'born', 'died', 'nationality', 'developer',
        'known_for', 'notable_work', 'location', 'about',
        'dimensions', 'designed_by', 'type__name', 'category__name', 'category_id'
    ))

    # Serialize the articles data to JSON
    articles_json = json.dumps(articles, cls=DjangoJSONEncoder)

    # Determine the user's role
    user_role = None
    if request.user.is_authenticated:
        if request.user.groups.filter(name="Admin").exists():
            user_role = "Admin"
        elif request.user.groups.filter(name="Tutor").exists():
            user_role = "Tutor"
        else:
            user_role = "Student"

    # Pass authentication state and user role to the template
    context = {
        'articles_json': articles_json,
        'user_authenticated': request.user.is_authenticated,
        'user_role': user_role,
    }
    return render(request, 'knowl/base.html', context)


@csrf_protect
def add_article(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            article = Article.objects.create(
                title=data['title'],
                about=data['about'],
                notable_work=data.get('notable_work'),
                year=data.get('year'),
                medium=data.get('medium'),
                dimensions=data.get('dimensions'),
                location=data.get('location'),
                nationality=data.get('nationality'),
                known_for=data.get('known_for'),
                category_id=data['category'],
                type_id=data['type']
            )
            return JsonResponse({'success': True, 'id': article.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Log the user in
            login(request, user)
            return redirect('index')
        else:
            # Return an 'invalid login' error message.
            login_error = 'Invalid username or password.'
            articles = list(Article.objects.values(
                'title', 'born', 'died', 'nationality', 'developer',
                'known_for', 'notable_work', 'location', 'about',
                'dimensions', 'designed_by', 'type__name', 'category__name', 'category_id'
            ))
            articles_json = json.dumps(articles, cls=DjangoJSONEncoder)
            return render(request, 'knowl/base.html', {
                'articles_json': articles_json,
                'show_login_modal': True,
                'login_error': login_error
            })
    else:
        return redirect('index')

def signup(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 != password2:
            signup_error = 'Passwords do not match.'
            articles = list(Article.objects.values(
                'title', 'born', 'died', 'nationality', 'developer',
                'known_for', 'notable_work', 'location', 'about',
                'dimensions', 'designed_by', 'type__name', 'category__name', 'category_id'
            ))
            articles_json = json.dumps(articles, cls=DjangoJSONEncoder)
            return render(request, 'knowl/base.html', {
                'articles_json': articles_json,
                'show_signup_modal': True,
                'signup_error': signup_error
            })

        if User.objects.filter(username=email).exists():
            signup_error = 'Email is already registered.'
            articles = list(Article.objects.values(
                'title', 'born', 'died', 'nationality', 'developer',
                'known_for', 'notable_work', 'location', 'about',
                'dimensions', 'designed_by', 'type__name', 'category__name', 'category_id'
            ))
            articles_json = json.dumps(articles, cls=DjangoJSONEncoder)
            return render(request, 'knowl/base.html', {
                'articles_json': articles_json,
                'show_signup_modal': True,
                'signup_error': signup_error
            })

        try:
            user = User.objects.create_user(username=email, email=email, password=password1)
            user.save()
            # Assign user to 'Student' group by default
            student_group, created = Group.objects.get_or_create(name='Student')
            user.groups.add(student_group)
            login(request, user)
            return redirect('index')
        except Exception as e:
            signup_error = 'An error occurred during signup.'
            articles = list(Article.objects.values(
                'title', 'born', 'died', 'nationality', 'developer',
                'known_for', 'notable_work', 'location', 'about',
                'dimensions', 'designed_by', 'type__name', 'category__name', 'category_id'
            ))
            articles_json = json.dumps(articles, cls=DjangoJSONEncoder)
            return render(request, 'knowl/base.html', {
                'articles_json': articles_json,
                'show_signup_modal': True,
                'signup_error': signup_error
            })
    else:
        return redirect('index')

def user_logout(request):
    logout(request)
    return redirect('index')

@login_required
@user_passes_test(lambda u: u.groups.filter(name="Admin").exists(), login_url="/", redirect_field_name=None)
def fetch_users(request):
    try:
        users = User.objects.all().values("id", "username", "email", "groups__name")
        return JsonResponse(list(users), safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@user_passes_test(lambda u: u.groups.filter(name="Admin").exists(), login_url="/", redirect_field_name=None)
@csrf_exempt
def delete_user(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id")
        if not user_id:
            print("DEBUG: No user_id provided in the request.")  # Debugging
            return JsonResponse({"status": "error", "message": "User ID not provided."}, status=400)

        try:
            user = User.objects.get(id=user_id)
            print(f"DEBUG: Attempting to delete user: {user.username} (ID: {user_id})")  # Debugging
            if user.is_superuser:
                print("DEBUG: Cannot delete superuser.")  # Debugging
                return JsonResponse({"status": "error", "message": "Cannot delete superuser."}, status=403)
            user.delete()
            print(f"DEBUG: Successfully deleted user with ID {user_id}.")  # Debugging
            return JsonResponse({"status": "success", "message": "User deleted successfully."})
        except User.DoesNotExist:
            print(f"DEBUG: User with ID {user_id} not found.")  # Debugging
            return JsonResponse({"status": "error", "message": "User not found."}, status=404)
        except Exception as e:
            print(f"DEBUG: Exception occurred: {str(e)}")  # Debugging
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    print("DEBUG: Invalid request method.")  # Debugging
    return JsonResponse({"status": "error", "message": "Invalid request method."}, status=405)

