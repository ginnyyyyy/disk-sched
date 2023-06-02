import Chart from "chart.js/auto";

const renderLineGraph = (requests, totalHeadMovement, seekTime) => {
  const canvas = document.getElementById("lineGraph");
  const ctx = canvas.getContext("2d");

  if (canvas.chart) {
    canvas.chart.data.labels = requests;
    canvas.chart.data.datasets[0].data = requests;
    canvas.chart.update();
  } else {
    const lineGraph = new Chart(ctx, {
      type: "line",
      data: {
        labels: requests,
        datasets: [
          {
            label: "Head Movement",
            data: requests,
            backgroundColor: "rgb(41, 128, 185)",
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            grid: {
              color: "rgb(41, 128, 185)",
            },
            beginAtZero: true,
            ticks: {},
          },
          x: {
            beginAtZero: true,
            grid: {
              color: "rgb(41, 128, 185)",
            },
          },
        },
      },
    });

    canvas.chart = lineGraph;
  }
  const thmElement = document.getElementById("totalHeadMovement");
  const stElement = document.getElementById("seekTime");

  thmElement.textContent = `${totalHeadMovement}`;
  stElement.textContent = `${seekTime}`;
};

export const handleSubmit = (
  e,
  cylinderList,
  initialHeadPosition,
  previousHeadPosition,
  armMovement,
  diskRequests,
  setDiskRequests,
  algorithm
) => {
  e.preventDefault();
  const requests = diskRequests
    .split(" ")
    .map((request) => parseInt(request.trim()));
  const direction =
    parseInt(previousHeadPosition) > parseInt(initialHeadPosition)
      ? "downwards"
      : "upwards";
  const endTrack = cylinderList - 1;
  const startTrack = 0;

  let insertIndex = 0;
  for (let i = 1; i < requests.length; i++) {
    if (
      (requests[i] > previousHeadPosition &&
        requests[i + 1] < previousHeadPosition) ||
      (requests[i] < previousHeadPosition &&
        requests[i + 1] > previousHeadPosition)
    ) {
      insertIndex = i + 1;
      break;
    }
  }

  requests.splice(insertIndex, 0, parseInt(previousHeadPosition));
  setDiskRequests((prevRequests) => [...prevRequests, ...requests]);

  console.log("Raw Requests:", requests);
  console.log("Sorted ASC Requests:", requests);
  console.log("Algorithm", algorithm);
  console.log("Direction:", direction);

  if (algorithm == "fifo") {
    requests.unshift(parseInt(initialHeadPosition));
    console.log("Sorted Requests:", requests);
    let totalHeadMovement = 0;
    let currentHeadPosition = parseInt(initialHeadPosition);

    for (let i = 0; i < requests.length; i++) {
      const currentRequest = requests[i];
      totalHeadMovement += Math.abs(currentRequest - currentHeadPosition);
      currentHeadPosition = currentRequest;
    }

    const seekTime = (cylinderList * armMovement) / totalHeadMovement;

    console.log("Total Head Movement:", totalHeadMovement);
    console.log("Seek Time:", seekTime);

    renderLineGraph(requests, totalHeadMovement, seekTime);
  } else if (algorithm == "sstf") {
    const sortedRequests = requests.sort((a, b) => a - b);
    sortedRequests.unshift(parseInt(initialHeadPosition));
    console.log("Sorted Request:", sortedRequests);
    let totalHeadMovement = 0;
    let currentHeadPosition = parseInt(initialHeadPosition);

    for (let i = 0; i < sortedRequests.length - 1; i++) {
      const difference1 = Math.abs(sortedRequests[i] - sortedRequests[i + 1]);
      console.log("diff1:", sortedRequests);
      const difference2 = Math.abs(sortedRequests[i] - sortedRequests[i + 2]);
      console.log("diff2:", sortedRequests);

      const minDifference = Math.max(difference1, difference2);

      if (minDifference === difference1) {
        [sortedRequests[i + 1], sortedRequests[i + 2]] = [
          sortedRequests[i + 2],
          sortedRequests[i + 1],
        ];
      }
    }

    for (let i = 0; i < sortedRequests.length; i++) {
      const currentRequest = sortedRequests[i];
      totalHeadMovement += Math.abs(currentRequest - currentHeadPosition);
      currentHeadPosition = currentRequest;
    }

    const seekTime = (cylinderList * armMovement) / totalHeadMovement;

    console.log("Total Head Movement:", totalHeadMovement);
    console.log("Seek Time:", seekTime);

    renderLineGraph(sortedRequests, totalHeadMovement, seekTime);
  } else if (algorithm == "scan") {
    const sortedRequests = requests.sort((a, b) => a - b);
    let totalHeadMovement = 0;
    let currentHeadPosition = parseInt(initialHeadPosition);

    const sortedRequestsCopy = [...sortedRequests];
    const sortedUpwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests >= currentHeadPosition)
      .sort((a, b) => a - b);
    const sortedDownwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests < currentHeadPosition)
      .sort((a, b) => b - a);

    let arrangedRequests;
    if (direction === "downwards") {
      arrangedRequests = [...sortedDownwards, startTrack, ...sortedUpwards];
    } else {
      arrangedRequests = [...sortedUpwards, endTrack, ...sortedDownwards];
    }

    arrangedRequests.unshift(parseInt(initialHeadPosition));
    console.log("Sorted Request:", arrangedRequests);

    for (let i = 0; i < arrangedRequests.length; i++) {
      const currentRequest = arrangedRequests[i];
      totalHeadMovement += Math.abs(currentRequest - currentHeadPosition);
      currentHeadPosition = currentRequest;
    }

    const seekTime = (cylinderList * armMovement) / totalHeadMovement;

    console.log("Total Head Movement:", totalHeadMovement);
    console.log("Seek Time:", seekTime);

    renderLineGraph(arrangedRequests, totalHeadMovement, seekTime);
  } else if (algorithm == "cscan") {
    const sortedRequests = requests.sort((a, b) => a - b);
    let totalHeadMovement = 0;
    let currentHeadPosition = parseInt(initialHeadPosition);

    const sortedRequestsCopy = sortedRequests.filter(
      (request) => request !== parseInt(previousHeadPosition)
    );
    const sortedUpwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests >= currentHeadPosition)
      .sort((a, b) => b - a);
    const sortedDownwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests < currentHeadPosition)
      .sort((a, b) => b - a);
    const sortedUpwards1 = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests >= currentHeadPosition)
      .sort((a, b) => a - b);
    const sortedDownwards1 = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests < currentHeadPosition)
      .sort((a, b) => a - b);

    let arrangedRequests;
    if (direction === "downwards") {
      arrangedRequests = [
        ...sortedDownwards,
        startTrack,
        previousHeadPosition,
        endTrack,
        ...sortedUpwards,
      ];
    } else {
      arrangedRequests = [
        ...sortedUpwards1,
        endTrack,
        previousHeadPosition,
        startTrack,
        ...sortedDownwards1,
      ];
      console.log("entered here");
    }

    arrangedRequests.unshift(parseInt(initialHeadPosition));
    console.log("Sorted Request:", arrangedRequests);

    for (let i = 0; i < arrangedRequests.length; i++) {
      const currentRequest = arrangedRequests[i];
      totalHeadMovement += Math.abs(currentRequest - currentHeadPosition);
      currentHeadPosition = currentRequest;
    }

    const seekTime = (cylinderList * armMovement) / totalHeadMovement;

    console.log("Total Head Movement:", totalHeadMovement);
    console.log("Seek Time:", seekTime);
    console.log("Direction:", direction);

    renderLineGraph(arrangedRequests, totalHeadMovement, seekTime);
  } else if (algorithm == "look") {
    const sortedRequests = requests.sort((a, b) => a - b);
    let totalHeadMovement = 0;
    let currentHeadPosition = parseInt(initialHeadPosition);

    const sortedRequestsCopy = [...sortedRequests];
    const sortedUpwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests >= currentHeadPosition)
      .sort((a, b) => a - b);
    const sortedDownwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests < currentHeadPosition)
      .sort((a, b) => b - a);

    let arrangedRequests;
    if (direction === "downwards") {
      arrangedRequests = [...sortedDownwards, ...sortedUpwards];
    } else {
      arrangedRequests = [...sortedUpwards, ...sortedDownwards];
    }

    arrangedRequests.unshift(parseInt(initialHeadPosition));
    console.log("Sorted Request:", arrangedRequests);

    for (let i = 0; i < arrangedRequests.length; i++) {
      const currentRequest = arrangedRequests[i];
      totalHeadMovement += Math.abs(currentRequest - currentHeadPosition);
      currentHeadPosition = currentRequest;
    }

    const seekTime = (cylinderList * armMovement) / totalHeadMovement;

    console.log("Total Head Movement:", totalHeadMovement);
    console.log("Seek Time:", seekTime);

    renderLineGraph(arrangedRequests, totalHeadMovement, seekTime);
  } else if (algorithm == "clook") {
    const sortedRequests = requests.sort((a, b) => a - b);
    let totalHeadMovement = 0;
    let currentHeadPosition = parseInt(initialHeadPosition);

    const sortedRequestsCopy = [...sortedRequests];
    const sortedUpwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests >= currentHeadPosition)
      .sort((a, b) => a - b);
    const sortedDownwards = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests < currentHeadPosition)
      .sort((a, b) => b - a);
    const sortedUpwards1 = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests >= currentHeadPosition)
      .sort((a, b) => b - a);
    const sortedDownwards1 = sortedRequestsCopy
      .filter((sortedRequests) => sortedRequests < currentHeadPosition)
      .sort((a, b) => a - b);

    let arrangedRequests;
    if (direction === "downwards") {
      arrangedRequests = [...sortedDownwards, ...sortedUpwards1];
    } else {
      arrangedRequests = [...sortedUpwards, ...sortedDownwards1];
    }

    arrangedRequests.unshift(parseInt(initialHeadPosition));
    console.log("Sorted Request:", arrangedRequests);

    for (let i = 0; i < arrangedRequests.length; i++) {
      const currentRequest = arrangedRequests[i];
      totalHeadMovement += Math.abs(currentRequest - currentHeadPosition);
      currentHeadPosition = currentRequest;
    }

    const seekTime = (cylinderList * armMovement) / totalHeadMovement;

    console.log("Total Head Movement:", totalHeadMovement);
    console.log("Seek Time:", seekTime);

    renderLineGraph(arrangedRequests, totalHeadMovement, seekTime);
  }
};
