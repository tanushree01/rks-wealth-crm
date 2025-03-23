pipeline {
    agent any

    environment {
        REPO = 'shivamgoswami2711/rks-wealth-crm' // Change to your repo
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'dev', url: "https://github.com/${env.REPO}.git"
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh 'docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD"'
                    sh 'docker tag rks_backend mydockerhubuser/rks_backend:latest'
                    sh 'docker tag rks_frontend mydockerhubuser/rks_frontend:latest'
                    sh 'docker push mydockerhubuser/rks_backend:latest'
                    sh 'docker push mydockerhubuser/rks_frontend:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
