from django.db import models


class OrderedContent(models.Model):
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['order', 'id']


class SiteProfile(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=180)
    tagline = models.TextField()
    status = models.CharField(max_length=180)
    email = models.EmailField()
    location = models.CharField(max_length=120)
    summary = models.TextField()
    current_work = models.TextField()
    future_direction = models.TextField()

    def __str__(self):
        return self.name


class SocialLink(OrderedContent):
    label = models.CharField(max_length=40)
    value = models.CharField(max_length=160)
    url = models.URLField(blank=True)
    icon = models.CharField(max_length=8, default='↗')

    def __str__(self):
        return self.label


class Skill(OrderedContent):
    key = models.SlugField(unique=True)
    title_primary = models.CharField(max_length=100)
    title_secondary = models.CharField(max_length=120)
    accent_color = models.CharField(max_length=20, default='#00e5ff')
    description = models.TextField()

    def __str__(self):
        return self.title_primary


class Experience(OrderedContent):
    slug = models.SlugField(unique=True)
    company = models.CharField(max_length=120)
    role = models.CharField(max_length=180)
    period = models.CharField(max_length=80)
    location = models.CharField(max_length=180)
    url = models.URLField(blank=True)
    headline = models.CharField(max_length=200)
    description = models.TextField()
    deliverables = models.JSONField(default=list)
    tech = models.JSONField(default=list)
    metric = models.CharField(max_length=180)

    def __str__(self):
        return f'{self.company} — {self.role}'


class Project(OrderedContent):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=180)
    category = models.CharField(max_length=50)
    category_label = models.CharField(max_length=100)
    tag = models.CharField(max_length=120)
    description = models.TextField()
    tech = models.JSONField(default=list)
    metrics = models.CharField(max_length=180)
    case_study = models.TextField(blank=True)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Log(OrderedContent):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=180)
    date = models.DateField()
    category = models.CharField(max_length=120)
    excerpt = models.TextField()
    content = models.JSONField(default=list)

    def __str__(self):
        return self.title


class ProcessStep(OrderedContent):
    number = models.CharField(max_length=8)
    title = models.CharField(max_length=120)
    description = models.TextField()
    tools = models.CharField(max_length=180)

    def __str__(self):
        return f'{self.number} — {self.title}'


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} — {self.email}'