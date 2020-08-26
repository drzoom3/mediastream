const app = new Vue({
    el: '#app',
    data: {
        onCall: false,
        cameraActive: true,
        loading: false,
        comments: [],
        videoStream: null,
    },
    
    methods: {
        goToCall() {
            this.onCall = true;
            
            this.startAudio();
            this.startVideo();
            this.fetchComents();
        },

        toggleCamera() {
            this.cameraActive = !this.cameraActive;

            if (this.cameraActive) {
                this.startVideo();
            } else {
                this.stopVideo();
            }
        },
        
        renderVideo() {
            const video = this.$refs.video;
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');
            
            const step = () => {
                if (this.cameraActive) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                } else {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        },

        startVideo() {
            this.loading = true;

            navigator.mediaDevices.getUserMedia({video: this.cameraActive, audio: false}).then(mediaStream => {
                const video = this.$refs.video;
                video.srcObject = mediaStream;
                
                this.videoStream = mediaStream;

                video.onloadedmetadata = e => {
                    video.addEventListener('play', this.renderVideo);
                    this.loading = false;
                    video.play();
                };
            }).catch( e => {
                console.log('Reeeejected!', e);
            });
        },

        stopVideo() {
            const video = this.$refs.video;

            this.videoStream.getTracks().forEach(track => track.stop());

            video.srcObject = null;
            video.pause();
            video.removeEventListener('play', this.renderVideo);

        },

        startAudio() {
            navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(mediaStream => {
                const audio = this.$refs.audio;
                audio.srcObject = mediaStream;

                audio.play();
            }).catch( e => {
                console.log('Reeeejected!', e);
            });
        },

        fetchComents() {
            fetch('https://jsonplaceholder.typicode.com/comments').then(response => {
                return response.json();
            }).then(data => {
                this.comments = data;
            }).catch( e => {
                console.log('Reeeejected!', e);
            });;
        }
    }
})