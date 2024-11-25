from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder
import json
from .models import Article
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect

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

