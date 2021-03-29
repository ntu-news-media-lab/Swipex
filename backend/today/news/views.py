from django.shortcuts import render
from rest_framework import viewsets

from .serializers import NewsSerializer, ReaderSerializer
from .models import News, Reader
# Create your views here.

class NewsViewSet(viewsets.ModelViewSet):
	serializer_class = NewsSerializer
	#queryset = News.objects.all().order_by('news_id')

	#pr = PR.objects.filter(user=request.user.id).values_list('jq__id', flat=True)
 	#jq = JQ.objects.filter(somefield=someval).exclude(id__in=pr)
	def get_queryset(self):
		if self.request.method == 'GET':
			reader= self.request.query_params.get('user_id', None)
			if reader is not None:
				readers = Reader.objects.filter(user_id = reader).values_list('has_read', flat=True)
				queryset = News.objects.exclude(news_id__in = readers )
			else:
				queryset = News.objects.all().order_by('?')
			return queryset
	



class ReaderViewSet(viewsets.ModelViewSet):
	queryset = Reader.objects.all()
	serializer_class = ReaderSerializer