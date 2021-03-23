from rest_framework import serializers
from .models import News

class NewsSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = News
		fields = ("news_id", "section","title", "headline","image","url")