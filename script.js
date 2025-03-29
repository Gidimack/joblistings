document.addEventListener("DOMContentLoaded", () => {
    const jobListingsContainer = document.getElementById("job-listings");
    const filterContainer = document.getElementById("filter-container");
    const filtersDiv = document.getElementById("filters");
    const clearBtn = document.getElementById("clear-btn");

    let selectedFilters = [];

    // Fetch Job Data
    fetch("data.json")
        .then(response => response.json())
        .then(data => renderJobs(data));

    // Render Jobs
    function renderJobs(jobs) {
        jobListingsContainer.innerHTML = "";
        jobs.forEach(job => {
            if (selectedFilters.length === 0 || selectedFilters.every(tag => job.languages.includes(tag) || job.tools.includes(tag))) {
                const jobCard = document.createElement("div");
                jobCard.classList.add("job-card");

                jobCard.innerHTML = `
                    <div class="job-info">
                        <img src="${job.logo}" alt="${job.company}">
                        <div class="job-details">
                            <h3>${job.position}</h3>
                            <p>${job.postedAt} • ${job.contract} • ${job.location}</p>
                        </div>
                    </div>
                    <div class="job-tags">
                        ${[...job.languages, ...job.tools].map(tag => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                `;

                jobListingsContainer.appendChild(jobCard);
            }
        });

        // Attach event listeners to job tags
        document.querySelectorAll(".tag").forEach(tag => {
            tag.addEventListener("click", () => addFilter(tag.textContent));
        });
    }

    // Add Filter
    function addFilter(filter) {
        if (!selectedFilters.includes(filter)) {
            selectedFilters.push(filter);
            updateFilters();
        }
    }

    // Update Filters Display
    function updateFilters() {
        filtersDiv.innerHTML = "";
        selectedFilters.forEach(filter => {
            const filterTag = document.createElement("span");
            filterTag.classList.add("filter-tag");
            filterTag.innerHTML = `${filter} <button class="remove-tag">×</button>`;

            filterTag.querySelector(".remove-tag").addEventListener("click", () => removeFilter(filter));
            filtersDiv.appendChild(filterTag);
        });

        filterContainer.classList.toggle("hidden", selectedFilters.length === 0);
        fetch("data.json").then(response => response.json()).then(data => renderJobs(data));
    }

    // Remove Filter
    function removeFilter(filter) {
        selectedFilters = selectedFilters.filter(f => f !== filter);
        updateFilters();
    }

    // Clear All Filters
    clearBtn.addEventListener("click", () => {
        selectedFilters = [];
        updateFilters();
    });
});
