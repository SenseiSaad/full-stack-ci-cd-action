from django.db import models

class WorkExp(models.Model):
    title = models.CharField(max_length=255)
    short_description = models.TextField()
    long_description = models.TextField(blank=True)
    tech_stack = models.CharField(max_length=255, blank=True)
    live_url = models.URLField(null=True, blank=True)
    github_link = models.URLField(null=True, blank=True)
    company_name = models.CharField(max_length=255, null=True, default="Private", blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
