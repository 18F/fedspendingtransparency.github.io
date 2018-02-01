const dataModule = function() {
  const mem = {};

  function loadStates(cb) {
    d3.json("../../../data-lab-data/fedscope-tool/states.json", function(
      error,
      data
    ) {
      if (error) throw error;
      mem.states = data;
      cb(data);
    });
  }

  function loadAgencies(cb) {
    d3.json("../../../data-lab-data/fedscope-tool/agencies.json", function(
      error,
      data
    ) {
      if (error) throw error;
      mem.agencies = data;
      cb(data);
    });
  }

  function loadOccupationCategories(cb) {
    d3.json(
      "../../../data-lab-data/fedscope-tool/occupationCategories.json",
      function(error, data) {
        if (error) throw error;
        mem.occupationCategories = data;
        cb(data);
      }
    );
  }

  function loadEmployeeCountData(cbs, props) {
    d3.json("../../../data-lab-data/fedscope-tool/employees.json", function(
      error,
      data
    ) {
      if (error) throw error;
      mem.employeeCounts = data;
      cbs.forEach(cb => cb(data, props));
    });
  }

  function loadEmployeeSalaryData(cbs, props) {
    d3.json(
      "../../../data-lab-data/fedscope-tool/employeeSalaries.json",
      function(error, data) {
        if (error) throw error;
        mem.employeeSalaries = data;
        cbs.forEach(cb => cb(data, props));
      }
    );
  }

  return {
    loadEmployeeCountData,
    loadEmployeeSalaryData,
    loadStates,
    loadAgencies,
    loadOccupationCategories,
    mem
  };
};
