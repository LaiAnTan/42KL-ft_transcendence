route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h 
  receiver: 'web.hook'
receivers:
- name: 'email-notifications'
  email_configs:
  - to: 'tanlaian2004@gmail.com'
    from: '${SMTP_USERNAME}@gmail.com'
    smarthost: smtp.gmail.com:587
    auth_username: '${SMTP_USERNAME}'
    auth_password: '${SMTP_PASSWORD}'