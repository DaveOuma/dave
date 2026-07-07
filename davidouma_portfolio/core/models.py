# Create your models here.
from django.db import models
from django.utils import timezone

class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technologies = models.CharField(max_length=255)  # comma separated
    github_link = models.URLField(blank=True)
    demo_link = models.URLField(blank=True)
    case_study_link = models.URLField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def tech_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]

class Publication(models.Model):
    title = models.CharField(max_length=300)
    journal = models.CharField(max_length=200)
    year = models.IntegerField()
    doi = models.CharField(max_length=100, blank=True)
    pdf_link = models.URLField(blank=True)
    category = models.CharField(max_length=50, choices=[
        ('software', 'Software Engineering'),
        ('edtech', 'EdTech'),
        ('fintech', 'FinTech'),
        ('ai', 'AI & Data'),
    ])
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

class Testimonial(models.Model):
    author = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)  # 1-5
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.author} – {self.title}"

class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.CharField(max_length=50, choices=[
        ('programming', 'Programming'),
        ('research', 'Research'),
        ('education', 'Education'),
        ('technology', 'Technology'),
        ('ai', 'AI'),
        ('fintech', 'FinTech'),
        ('scientific_writing', 'Scientific Writing'),
    ])
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    published_date = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=True)
    image = models.ImageField(upload_to='blog/', blank=True, null=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title