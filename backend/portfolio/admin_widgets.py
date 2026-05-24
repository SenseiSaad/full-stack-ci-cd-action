from django import forms


class RichTextContentWidget(forms.Textarea):
    class Media:
        css = {
            'all': ('logs/richtext_admin.css',),
        }
        js = ('logs/richtext_admin.js',)
