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

        stage('Deploy') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}
