from rest_framework import serializers
from base.models import User, Matchup, Versus, Tournament


class UserSerializer(serializers.ModelSerializer):
    
    profile_pic_url = serializers.SerializerMethodField()
    class Meta:

        model = User
        fields = '__all__'

    def get_profile_pic_url(self, obj):
        if obj.profile_pic and hasattr(obj.profile_pic, 'url'):
            return self.context['request'].build_absolute_uri(obj.profile_pic.url)
        else:
            return None


class MatchupSerializer(serializers.ModelSerializer):

    class Meta:

        model = Matchup
        fields = '__all__'


class VersusSerializer(serializers.ModelSerializer):

    class Meta:

        model = Versus
        fields = '__all__'


class TournamentSerializer(serializers.ModelSerializer):

    class Meta:

        model = Tournament
        fields = '__all__'

class ImageSerializer(serializers.Serializer):

    image = serializers.ImageField()