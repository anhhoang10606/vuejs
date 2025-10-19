<script setup>
</script>
<template>
    <main class="container py-4">
        <slot name="header" :title="title">
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Navbar</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Features</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">Pricing</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link disabled" aria-disabled="true">Disabled</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </slot>
        <slot name="content">

        </slot>

        <!-- Pagination -->
        <!-- <nav aria-label="Post navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item disabled"><span class="page-link">Previous</span></li>
        <li class="page-item active" aria-current="page"><span class="page-link">1</span></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav> -->
    </main>

</template>


<style scoped>
.success {
    color: green;
}

.error {
    color: red;
}

.post-excerpt {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.post-thumb {
    width: 120px;
    height: 80px;
    object-fit: cover;
    border-radius: .5rem;
}

@media (max-width: 575.98px) {
    .post-thumb {
        width: 100%;
        height: 160px;
    }
}
</style>