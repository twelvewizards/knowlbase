from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        db_table = 'categories'
        managed = False

    def __str__(self):
        return self.name

class Type(models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        db_table = 'types'
        managed = False

    def __str__(self):
        return self.name

class Article(models.Model):
    title = models.CharField(max_length=255)
    notable_work = models.TextField(blank=True, null=True)
    about = models.TextField()
    year = models.CharField(max_length=50, blank=True, null=True)
    medium = models.CharField(max_length=100, blank=True, null=True)
    dimensions = models.CharField(max_length=50, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    born = models.CharField(max_length=50, blank=True, null=True)
    died = models.CharField(max_length=50, blank=True, null=True)
    nationality = models.CharField(max_length=50, blank=True, null=True)
    known_for = models.CharField(max_length=255, blank=True, null=True)
    designed_by = models.CharField(max_length=100, blank=True, null=True)
    developer = models.CharField(max_length=100, blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    type = models.ForeignKey(Type, on_delete=models.CASCADE)

    class Meta:
        db_table = 'articles'
        managed = True

    def __str__(self):
        return self.title
