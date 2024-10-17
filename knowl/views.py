from django.http import HttpResponse
from .models import Article

def index(request):
    # Fetch all articles
    articles = Article.objects.all()

    # Prepare plain-text response
    response = "\n".join([f"Title: {article.title}, About: {article.about}, Category ID: {article.category_id}" for article in articles])

    return HttpResponse(response, content_type="text/plain")
