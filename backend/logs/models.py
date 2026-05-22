from django.db import models

# Model to store blog posts/logs
class Log(models.Model):
    # Blog post title
    title = models.CharField(max_length=255)
    
    # Blog post content
    content = models.TextField()
    
    # Blog post category/topic
    category = models.CharField(max_length=100)
    
    # When blog was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # When blog was last updated
    updated_at = models.DateTimeField(auto_now=True)
    
    # Show blog title in admin
    def __str__(self):
        return self.title
    
    # Sort by newest first
    class Meta:
        ordering = ['-created_at']
