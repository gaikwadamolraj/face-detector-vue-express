<!-- src/views/UploadForm.vue -->
<template>
    <div class="inner-block">
        <div class="vue-tempalte">
            <div>
                <h2>New Request</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="form-group">
                        <label>Text</label>
                        <input type="text" v-model="textInput" placeholder="Enter text"
                            class="form-control form-control-lg">
                    </div>
                    <div class="form-group">
                        <label>Uplod file</label>
                        <input type="file" ref="fileInput" accept="image/*" class="form-control form-control" />
                    </div>
                    <button type="submit" class="btn btn-dark btn-lg btn-block mt-2">Submit</button>
                </form>
                <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>
  
<script>
import { createRequest } from "../services/requests"
export default {
    data() {
        return {
            textInput: '',
            errorMessage: ''
        };
    },
    methods: {
        async handleSubmit() {
            // Handle form submission, including file upload
            const file = this.$refs.fileInput.files[0];

            let formData = new FormData();
            formData.append("file", file);
            formData.append("text", this.textInput);

            try {
                await createRequest(formData)
                this.$router.replace('/requests');
            } catch (error) {
                console.error(error)
                this.errorMessage = error?.message || 'Failed to upload the file'
            }
        },
    },
    mounted() {
        const token = localStorage.getItem('token');
        if (token) {
            this.Requests();
        } else {
            this.$router.replace('/login')
        }
    }
};
</script>
  