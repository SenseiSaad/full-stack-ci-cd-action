from django.db import models

# Model to store personal projects
class Project(models.Model):
    # Project title/name
    title = models.CharField(max_length=255)
    
    # Short description of project
    description = models.TextField()
    
    # Link to the live project
    live_link = models.URLField(null=True, blank=True)
    
    # Link to GitHub repository
    github_link = models.URLField(null=True, blank=True)
    
    # Technologies used (comma separated or semicolon separated)
    technologies = models.CharField(max_length=255)
    
    # When project was created
    created_at = models.DateTimeField(auto_now_add=True)
    
    # When project was last updated
    updated_at = models.DateTimeField(auto_now=True)
    
    # Show project title in admin
    def __str__(self):
        return self.title
    
    # Sort by newest first
    class Meta:
        ordering = ['-created_at']
