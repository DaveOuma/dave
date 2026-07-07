# Register your models here.
from django.contrib import admin
from .models import Project, Publication, Testimonial, BlogPost

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order')
    list_editable = ('is_active', 'order')

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'journal', 'year', 'category')
    list_filter = ('category', 'year')

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author', 'title', 'rating', 'order')
    list_editable = ('order',)

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_date', 'is_published')
    prepopulated_fields = {'slug': ('title',)}