from django.db import models
from django.contrib.postgres.fields import ArrayField


class User(models.Model):

    """
    Django model for Users table.

    Fields:
    id: primary key, user_id
    username: username of user
    match_history: array of match_ids, consisting of the matches the user has
    played
    """

    username = models.CharField(max_length=30)
    date_created = models.DateTimeField(auto_now_add=True)
    # match_history = ArrayField(models.IntegerField())


class Match(models.Model):

    """
    Django model for Match table.

    Fields:
    id: primary key, match_id
    """

    date_played = models.DateTimeField(auto_now_add=True)
    match_type = 0
    player_1_id = models.IntegerField()
    player_2_id = models.IntegerField()
    player_1_score = models.IntegerField()
    player_2_score = models.IntegerField()
    outcome = 0
