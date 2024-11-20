from django.shortcuts import render, redirect
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Group
from django.contrib import messages
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

    return render(request, 'knowl/base.html', {'articles_json': articles_json})

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Log the user in
            login(request, user)
            messages.success(request, 'Logged in successfully!')
            return redirect('index')
        else:
            # Return an 'invalid login' error message.
            login_error = 'Invalid username or password.'
            # Fetch articles data
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
            messages.success(request, 'Signup successful!')
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
    messages.success(request, 'Logged out successfully!')
    return redirect('index')
