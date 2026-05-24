from django.db import models

from portfolio.sanitizers import sanitize_plain_text

# Simple model to store contact form messages from users
class ContactMessage(models.Model):
    # This stores the user's name (max 255 characters)
    name = models.CharField(max_length=255)
    
    # This stores the user's email address
    email = models.EmailField()
    
    # This stores the subject/title of the message
    subject = models.CharField(max_length=255)
    
    # This stores the full message content
    message = models.TextField()
    
    # This automatically saves when the message was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Show the name and email when you see it in admin
    def __str__(self):
        return f"{self.name} - {self.email}"

    def save(self, *args, **kwargs):
        self.name = sanitize_plain_text(self.name)
        self.email = sanitize_plain_text(self.email).lower()
        self.subject = sanitize_plain_text(self.subject)
        self.message = sanitize_plain_text(self.message)
        super().save(*args, **kwargs)
    
    # Sort by newest first in admin
    class Meta:
        ordering = ['-created_at']
