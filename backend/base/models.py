import json
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.conf import settings

import os

class User(models.Model):

	"""
	Django model for User table.
	Used to store data of users.

	Fields:
	username: username of user
	versus_history: array of versus_ids, consisting of the versus matches the
	user has played
	tournament_history: array of tournament_ids, consisting of the matches the
	user has played
	"""

	username = models.CharField(max_length=20)
	display_name = models.CharField(max_length=20, blank=True)
	email = models.EmailField(max_length=100, blank=True)
	profile_pic = models.ImageField(upload_to="profiles/")
	versus_history = ArrayField(models.IntegerField(), blank=True)
	tournament_history = ArrayField(models.IntegerField(), blank=True)
	friends = ArrayField(models.CharField(max_length=20), blank=True, null=True)
	data_is_visible = models.BooleanField(default=False)
	is_online = models.BooleanField(default=False)
	date_created = models.DateTimeField(auto_now_add=True)

	def to_json(self):
		"""
		Return user data as JSON object.
		"""

		return {
			'username': self.username,
			'display_name': self.display_name,
			'email': self.email,
			'profile_pic': os.path.join(settings.MEDIA_URL, self.profile_pic.name),
			'versus_history': self.versus_history,
			'tournament_history': self.tournament_history,
			'friends': self.friends,
			'data_is_visible': False,
			'is_online': False,
			'date_created': self.date_created.strftime('%Y-%m-%d %H:%M:%S')
		}


class Matchup(models.Model):

	"""
	Django model for Matchup table.
	Used to store common data for a matchup between two players.

	Fields:
	id: primary key, matchup_id
	player_1_id: id of player 1
	player_2_id: id of player 1
	player_1_score: score of player 1
	player_2_score: score of player 2
	"""

	player_1_id = models.CharField(max_length=20)
	player_2_id = models.CharField(max_length=20)
	player_1_score = models.IntegerField()
	player_2_score = models.IntegerField()


class Versus(models.Model):

	"""
	Django model for Versus table.
	Used to store data for a match between two players, one-on-one.

	Fields:
	id: primary key, versus_id
	date_played: date of versus match
	matchup_id: id of match
	game_mode: mode of game played
	"""

	date_played = models.DateTimeField(auto_now_add=True)
	matchup_id = models.IntegerField()
	match_type = models.CharField(max_length=20, default=' ')


class Tournament(models.Model):

	"""
	Django model for Versus table.
	Used to store data for a match between two players, one-on-one.

	Fields:
	id: primary key, tournament_id
	date_played: date of tournament match
	player_ids: array of user_ids, consisting of the participants of the
	tournament
	placements: array of integers corresponding to the placements of each
	player in player_ids (same index in array)
	matchup_ids = array of matchup_ids, consisting of the matchups that
	happened in the tournament
	"""

	date_played = models.DateTimeField(auto_now_add=True)
	player_ids = ArrayField(models.CharField())
	placements = ArrayField(models.CharField())
	matchup_ids = ArrayField(models.IntegerField())

