<html>
<head>
<title>test</title>
<link type="text/css" rel="stylesheet" href="styles.css">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body>
<div class="ranking">
  <h1>Ranking:</h1>
  <ul>
  	<% _.each(data, function (rank) { %>
	  <li>
	  		<img src="<%= rank.avatar %>">
	  		<a class="name" href="http://nk.pl/profile/<%= rank.uid %>"><%= rank.name %></a>
	  		<a class="link" href="<%= rank.shortUrl %>"><%= rank.shortUrl %></a>
	  		<span class="fajne"><%= rank.likes %></span>
	  </li>
  	<% }); %>
  </ul>
</div>
</body>
</html>