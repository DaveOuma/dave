from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    subject = forms.CharField(max_length=200, required=False)
    message = forms.CharField(widget=forms.Textarea)

    def send_email(self):
        from django.core.mail import EmailMessage
        from django.conf import settings

        subject = f"Portfolio Contact: {self.cleaned_data['subject'] or 'No subject'}"
        body = (
            f"Name: {self.cleaned_data['name']}\n"
            f"Email: {self.cleaned_data['email']}\n\n"
            f"{self.cleaned_data['message']}"
        )
        email = EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.CONTACT_EMAIL],
            reply_to=[self.cleaned_data['email']],
        )
        email.send(fail_silently=False)