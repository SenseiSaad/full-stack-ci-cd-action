from django.db import models

from .sanitizers import sanitize_rich_text


# Model to store blog posts/logs
class Log(models.Model):
    title = models.CharField(max_length=255)

    short_description = models.TextField()

    long_description = models.TextField(blank=True)

    tech_stack = models.CharField(max_length=255, blank=True)

    live_url = models.URLField(null=True, blank=True)

    github_link = models.URLField(null=True, blank=True)

    category = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.long_description = sanitize_rich_text(self.long_description)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
