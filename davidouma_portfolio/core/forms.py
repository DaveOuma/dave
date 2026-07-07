from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    subject = forms.CharField(max_length=200, required=False)
    message = forms.CharField(widget=forms.Textarea)

    def send_email(self):
        # send email logic--use settings
        from django.core.mail import send_mail
        subject = f"Portfolio Contact: {self.cleaned_data['subject'] or 'No subject'}"
        message = f"From: {self.cleaned_data['name']} <{self.cleaned_data['email']}>\n\n{self.cleaned_data['message']}"
        send_mail(subject, message, 'noreply@example.com', ['davidomuga@gmail.com'])