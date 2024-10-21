const goal = 2000000; // Mục tiêu
let totalReceived = 0; // Tổng số tiền đã nhận

// Hàm lấy dữ liệu từ URL JSON
async function fetchDonations() {
    try {
        // URL chứa dữ liệu JSON của bạn
        const response = await fetch("https://raw.githubusercontent.com/gocmodup/donate/refs/heads/main/t10.json");
        const donations = await response.json();

        // Tính tổng số tiền đã donate
        totalReceived = donations.reduce((acc, donation) => acc + donation.sotien, 0);

        // Cập nhật thanh tiến trình
        updateProgressBar();

        // Hiển thị danh sách vừa donate (người mới nhất lên đầu)
        displayRecentDonations(donations);

        // Hiển thị top 5 người donate nhiều nhất
        displayTopDonors(donations);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu donate:", error);
    }
}

// Hàm cập nhật thanh tiến trình
function updateProgressBar() {
    const progressElement = document.getElementById("progress");
    const progressPercentage = (totalReceived / goal) * 100;
    progressElement.style.width = progressPercentage + "%";
    progressElement.textContent = Math.round(progressPercentage) + "%";

    // Cập nhật mục tiêu
    document.getElementById("goal-text").textContent = `Đã nhận: ${totalReceived.toLocaleString()} / ${goal.toLocaleString()} VND`;
}

// Hiển thị danh sách vừa donate
function displayRecentDonations(donations) {
    const recentDonationsContainer = document.getElementById("recent-donations");
    recentDonationsContainer.innerHTML = ""; // Xóa nội dung cũ

    // Sắp xếp lại danh sách donate (người mới nhất lên đầu)
    const sortedDonations = donations.slice().reverse();

    // Hiển thị tối đa 10 người donate gần nhất
    sortedDonations.slice(0, 10).forEach(donation => {
        const donationItem = document.createElement("div");
        donationItem.style.margin = "10px 0";
        donationItem.style.padding = "10px";
        donationItem.style.backgroundColor = "#f9f9f9";
        donationItem.style.borderRadius = "5px";
        donationItem.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        donationItem.innerHTML = `<strong style="color: #333;">${donation.username}</strong>: ${donation.message} - ${donation.sotien.toLocaleString()} VND`;
        recentDonationsContainer.appendChild(donationItem);
    });
}

// Tính toán và hiển thị top donate
function displayTopDonors(donations) {
    const donorTotals = donations.reduce((acc, donation) => {
        acc[donation.username] = (acc[donation.username] || 0) + donation.sotien;
        return acc;
    }, {});

    const topDonors = Object.entries(donorTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const topDonorsContainer = document.getElementById("top-donors");
    topDonorsContainer.innerHTML = ""; // Xóa nội dung cũ

    topDonors.forEach(([username, total]) => {
        const topDonorItem = document.createElement("div");
        topDonorItem.style.margin = "10px 0";
        topDonorItem.style.padding = "10px";
        topDonorItem.style.backgroundColor = "#f9f9f9";
        topDonorItem.style.borderRadius = "5px";
        topDonorItem.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
        topDonorItem.innerHTML = `<strong style="color: #333;">${username}</strong>: Tổng cộng ${total.toLocaleString()} VND`;
        topDonorsContainer.appendChild(topDonorItem);
    });
}

// Gọi hàm lấy dữ liệu khi trang được tải
fetchDonations();
