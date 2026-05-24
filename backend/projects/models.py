from django.db import models

from portfolio.sanitizers import sanitize_plain_text, sanitize_rich_text


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

    def save(self, *args, **kwargs):
        self.title = sanitize_plain_text(self.title)
        self.short_description = sanitize_plain_text(self.short_description)
        self.tech_stack = sanitize_plain_text(self.tech_stack)
        self.long_description = sanitize_rich_text(self.long_description)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
