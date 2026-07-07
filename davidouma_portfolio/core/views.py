# Create your views here.
from django.shortcuts import render
from django.http import JsonResponse
from .models import Project, Publication, Testimonial, BlogPost
from .forms import ContactForm

def index(request):
    projects = Project.objects.filter(is_active=True)
    publications = Publication.objects.all()
    testimonials = Testimonial.objects.all()
    blog_posts = BlogPost.objects.filter(is_published=True)[:3]

    context = {
        'projects': projects,
        'publications': publications,
        'testimonials': testimonials,
        'blog_posts': blog_posts,
        'contact_form': ContactForm(),
    }
    return render(request, 'core/index.html', context)

def contact_submit(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.send_email()
            return JsonResponse({'success': True, 'message': 'Thank you! Your message has been sent.'})
        return JsonResponse({'success': False, 'errors': form.errors}, status=400)
    return JsonResponse({'success': False, 'message': 'Invalid request'}, status=400)