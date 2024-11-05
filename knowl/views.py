from django.shortcuts import render
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

    return render(request, 'knowl/base.html', {'articles_json': articles_json})

