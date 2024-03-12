from rest_framework import serializers
from base.models import User, Matchup, Versus, Tournament


class UserSerializer(serializers.ModelSerializer):

	class Meta:

		model = User
		fields = '__all__'


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

