class Job {
    // constructor
    constructor(jobData) {
        this.title = jobData.Title;
        this.posted = jobData.Posted;
        this.type = jobData.Type;
        this.level = jobData.Level;
        this.skill = jobData.Skill;
        this.detail = jobData.Detail;
    }

    // Retrieve formatted job details
    getDetails() {
        return {
            title: this.title,
            posted: this.posted,
            type: this.type,
            level: this.level,
            skill: this.skill,
            detail: this.detail,
        };
    }

    // get the time in minutes
    getFormattedPostedTime() {
        if (this.posted.includes("mins ago")) {
            return parseInt(this.posted);  
        } else if (this.posted.includes("hours ago")) {
            return parseInt(this.posted) * 60;  
        }
        return new Date(this.posted).getTime();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // elements
    const fileInput = document.getElementById('file-input');
    const jobListings = document.getElementById('job-listings');
    const errorDiv = document.getElementById('error');
    const filterLevel = document.getElementById('filter-level');
    const filterType = document.getElementById('filter-type');
    const filterSkill = document.getElementById('filter-skill');
    const filterButton = document.getElementById('filter-btn');
    const sortButton = document.getElementById('sort-btn');
    const sortBy = document.getElementById('sort-by');
    const jobDetailPopup = document.getElementById('jobDetailPopup');
    const jobDetailOverlay = document.getElementById('jobDetailOverlay');
    const closePopupButton = document.getElementById('closePopup');

    let jobs = [];

    // Function to display jobs
    const displayJobs = (jobsToDisplay) => {
        jobListings.innerHTML = ''; // Clear the job listings
        if (jobsToDisplay.length === 0) {
            jobListings.innerHTML = '<p>No jobs match the selected filters.</p>';
            return;
        }

        jobsToDisplay.forEach(job => {
            n = 1;
            const details = job.getDetails();
            const jobDiv = document.createElement('div');
            jobDiv.className = 'job';
            jobDiv.innerHTML = `<p>${details.title} - ${details.type} (${details.level})</p>`;
            jobDiv.addEventListener('click', () => showJobDetail(job));
            jobListings.appendChild(jobDiv);
            
        });
    };

    // Function to display job detail
    const showJobDetail = (job) => {
        const details = job.getDetails();
        const jobDetail = document.getElementById('job-detail');
        jobDetail.style.display = 'block';
        document.getElementById('detail-title').textContent = details.title;
        document.getElementById('detail-type').textContent = details.type;
        document.getElementById('detail-level').textContent = details.level;
        document.getElementById('detail-skill').textContent = details.skill;
        document.getElementById('detail-description').textContent = details.detail;
        document.getElementById('detail-posted').textContent = details.posted;
        jobDetailPopup.style.display = 'block';
        jobDetailOverlay.style.display = 'block';
    };

    // function to close popup
    const closePopup = () => {
        jobDetailPopup.style.display = 'none';
        jobDetailOverlay.style.display = 'none';
    };
    
    // event listener to close button for closing the popup
    closePopupButton.addEventListener('click', closePopup);
    
    // close popup when clicking outside
    jobDetailOverlay.addEventListener('click', closePopup);

    // function to filter jobs
    const filterJobs = () => {
        const level = filterLevel.value;
        const type = filterType.value;
        const skill = filterSkill.value;

        const filteredJobs = jobs.filter(job => {
            const details = job.getDetails();
            return (
                (level === 'All' || details.level === level) &&
                (type === 'All' || details.type === type) &&
                (skill === 'All' || details.skill === skill)
            );
        });

        displayJobs(filteredJobs);
    };

    // Function to sort jobs by title or date
    const sortJobs = () => {
        const sortOption = sortBy.value;

        const sortedJobs = [...jobs].sort((a, b) => {
            const detailsA = a.getDetails();
            const detailsB = b.getDetails();

            if (sortOption === 'title-asc') {
                return detailsA.title.localeCompare(detailsB.title);
            } 
            if (sortOption === 'date-posted') {
                return a.getFormattedPostedTime().localeCompare(b.getFormattedPostedTime());
            }
            
        });

        displayJobs(sortedJobs);
    };

    // event listeners
    filterButton.addEventListener('click', filterJobs);
    sortButton.addEventListener('click', sortJobs);

    // check files to be valid
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            errorDiv.textContent = 'Please select a valid file.';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jobDataArray = JSON.parse(e.target.result); // parse file
                jobs = jobDataArray.map(jobData => new Job(jobData)); // create Job objects
                displayJobs(jobs); // display jobs
                errorDiv.textContent = ''; 
            } catch (err) {
                errorDiv.textContent = 'Error parsing JSON file. Please check the file format.';
            }
        };

        reader.readAsText(file);
    });
});
