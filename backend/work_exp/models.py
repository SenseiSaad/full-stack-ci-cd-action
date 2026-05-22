from django.db import models

class WorkExp(models.Model):
    company_name=models.CharField(max_length=255, null=True, default="Private", blank=True)
    position=models.CharField(max_length=255)
    start_date=models.DateField()
    end_date=models.DateField(null=True, blank=True)
    description=models.TextField(null=True, blank=True)
    tool_stack=models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.position