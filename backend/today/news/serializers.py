from rest_framework import serializers
from .models import News, Reader

class NewsSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = News
		fields = ("news_id", "section","title", "headline","image","url","content")

class ReaderSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
			model = Reader
			fields = ("user_id", "has_read")