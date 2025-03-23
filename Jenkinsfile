pipeline {
    agent any

    environment {
        REPO = 'tanushree01/rks-wealth-crm' // Change to your repo
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
                    sh 'docker login -u "shivamparvat" -p "Shivamdocker@6162"'
                    sh 'docker tag rks-wealth-crm-backend shivamparvat/rks-wealth-crm-backend:latest'
                    sh 'docker tag rks-wealth-crm-frontend shivamparvat/rks-wealth-crm-frontend:latest'
                    sh 'docker push shivamparvat/rks-wealth-crm-backend:latest'
                    sh 'docker push shivamparvat/rks-wealth-crm-frontend:latest'
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
