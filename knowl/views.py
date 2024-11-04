from django.shortcuts import render
from .models import Article

def index(request):
    # Fetch all articles and their related categories
    articles = list(Article.objects.values(
        'title', 'born', 'died', 'nationality', 'developer', 
        'known_for', 'notable_work', 'location', 'about',
        'dimensions', 'designed_by', 'type__name', 'category__name', 'category_id'
    ))

    # Debugging log: Check if articles data is fetched correctly
    print("Articles fetched:", articles)
    
    return render(request, 'knowl/base.html', {'articles': articles})
