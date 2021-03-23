from django.db import models

# Create your models here.
class News (models.Model):
	news_id = models.IntegerField(primary_key = True)
	section = models.CharField(max_length=255)	
	title = models.CharField(max_length=255)
	headline = models.TextField()
	#headline = models.CharField(max_length=255)
	image = models.CharField(max_length=255)
	url = models.CharField(max_length=255)
	content = models.TextField()
	#content = models.CharField(max_length=255) 

	def __str__(self):
		return self.title