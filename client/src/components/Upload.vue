<!-- src/views/UploadForm.vue -->
<template>
    <div>
        <h2>Upload Image and Text</h2>
        <form @submit.prevent="handleSubmit">
            <input type="file" ref="fileInput" accept="image/*" />
            <textarea v-model="textInput" rows="4" placeholder="Enter text"></textarea>
            <button type="submit">Submit</button>
        </form>
        <p style="color: red;" v-if="errorMessage">{{ errorMessage }}</p>
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
                this.errorMessage = 'Failed to upload file'
            }
        },
    },
};
</script>
  