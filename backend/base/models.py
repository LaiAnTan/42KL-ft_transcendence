from django.db import models
from django.contrib.postgres.fields import ArrayField


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
	versus_history = ArrayField(models.IntegerField(), blank=True)
	tournament_history = ArrayField(models.IntegerField(), blank=True)
	date_created = models.DateTimeField(auto_now_add=True)


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

	player_1_id = models.IntegerField()
	player_2_id = models.IntegerField()
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
	"""

	date_played = models.DateTimeField(auto_now_add=True)
	matchup_id = models.IntegerField()


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
	player_ids = ArrayField(models.IntegerField())
	placements = ArrayField(models.IntegerField())
	matchup_ids = ArrayField(models.IntegerField())
