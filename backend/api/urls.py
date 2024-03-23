from django.urls import path
from django.conf.urls.static import static
from .views import views_User, views_Matchup, views_Versus, views_Tournament, authentication, views_GameRoom, alert
from django.conf import settings


urlpatterns = [
    path('addUser', views_User.addUser),
    path('getUser', views_User.getUser),
    path('allUsers', views_User.getAllUsers),
    path('editUser', views_User.editUser),
    path('deleteUser', views_User.deleteUser),
    path('uploadProfile', views_User.uploadProfile),
	path('addFriend', views_User.addFriend),
	path('removeFriend', views_User.removeFriend),
	path('getFriends', views_User.getFriends),
	path('setOnlineStatus', views_User.setOnlineStatus),
	path('getOnlineStatus', views_User.getOnlineStatus),
    path('addMatchup', views_Matchup.addMatchup),
    path('getMatchup', views_Matchup.getMatchup),
    path('allMatchups', views_Matchup.getAllMatchups),
    path('addVersus', views_Versus.addVersus),
    path('getVersus', views_Versus.getVersus),
    path('allVersus', views_Versus.getAllVersus),
    path('addTournament', views_Tournament.addTournament),
    path('getTournament', views_Tournament.getTournament),
    path('allTournaments', views_Tournament.getAllTournament),
    path('authConfig/', authentication.get_auth_config),
    path('postCode', authentication.postCode),
    path('matchmaking', views_GameRoom.matchmaking),
    path('closeRoom', views_GameRoom.closeRoom),
    path('joinRoom/<str:room_code>', views_GameRoom.joinRoom),
    path('allRooms', views_GameRoom.allRooms),
    path('closeAllRooms', views_GameRoom.closeAllRooms),
    path('exitRoom', views_GameRoom.exitRoom),
    path('alert', alert.alert),
    path('tournamentInit', views_GameRoom.tournamentInit),
    path('tournamentAssign', views_GameRoom.tournamentAssign),
	path('tournamentResults', views_GameRoom.tournamentResults),
    path('tournamentEnd', views_GameRoom.tournamentEnd),
	path('tournamentLoser', views_GameRoom.tournamentLoser),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

