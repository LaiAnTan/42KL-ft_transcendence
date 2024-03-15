FROM prom/alertmanager:latest

# Copy the bash script and Alertmanager template configuration into the container
COPY alertmanager.yml.tpl /etc/alertmanager/
COPY entrypoint.sh /entrypoint.sh

# Make the entrypoint script executable
RUN chmod +x /entrypoint.sh

# Run the entrypoint script when the container starts
ENTRYPOINT ["/entrypoint.sh"]