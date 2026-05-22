from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=255)

    short_description = models.TextField()

    long_description = models.TextField(blank=True)

    tech_stack = models.CharField(max_length=255, blank=True)

    live_url = models.URLField(null=True, blank=True)

    github_link = models.URLField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
