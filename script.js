
document.addEventListener('DOMContentLoaded', function() {

// Handle Dropdown
    const Dropdown = document.getElementById('filterDropdown')
    document.getElementById('filterButton').addEventListener('click', function() {
        Dropdown.classList.toggle('hidden')
    });

    
    
// Initialise filters for refrech
    let filter = JSON.parse(localStorage.getItem('filter')) || {
        completefilter : false,
        incompletefilter : false
    } 

    var completedfilter = document.getElementById('Completed')
    var incompletedfilter = document.getElementById('Incomplete')

    completedfilter.checked = filter.completefilter
    incompletedfilter.checked = filter.incompletefilter

// save filters
    function savefilter(){
        filter = {
            completefilter : completedfilter.checked,
            incompletefilter : incompletedfilter.checked
        }
        localStorage.setItem('filter', JSON.stringify(filter))
    }

// Apply Filters after loading tasks
    function ApplyFilters(){
        const AllTasks = document.querySelectorAll('.group')
        const showincomplete = incompletedfilter.checked
        const showcomplete = completedfilter.checked
        
        // Goes through each Tasks to check if should be shown or not
        AllTasks.forEach(taskElement => {
            const iscomplete = taskElement.dataset.status === 'true'
            const shouldShow = 
            (!showincomplete && !showcomplete) ||
            (showincomplete && !iscomplete) || 
            (showcomplete && iscomplete);
            

            taskElement.style.display = (shouldShow) ? 'flex' : 'none'

        } )
    }
// Initialise Tasks
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const container = document.getElementById('container')
    const NewTask = document.getElementById('Task')

    NewTask.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){
            AddTask()
        }
    })

//  load all the tasks
    function loadtasks(){
        container.innerHTML = ''
        tasks.forEach(task => {
            createElementTask(task)
        });
        ApplyFilters()
    }

    function savetask(){
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }

// create the UI

    function createElementTask(task){


        // task container
        let group = document.createElement('div')
        group.classList.add( 'mb-1','group', 'flex', 'w-full', 'py-3', 'bg-[#212020]', 'hover:bg-black', 'px-4', 'py-1', 'rounded-full', 'gap-2', 'items-center')
        group.dataset.taskID = task.id
        group.dataset.status = task.status

        // task status
        let status = document.createElement('div')
        status.classList.add( 'cursor-pointer','p-[0.19em]', 'rounded-full',)
        if(task.status){
            status.classList.add('bg-green-300', 'hover:bg-green-500')
        }else{
            status.classList.add('bg-[#cccccc]', 'hover:bg-[bg-green-900]')
        }
        let inside_status = document.createElement('div')
        inside_status.classList.add('p-[0.6em]', 'rounded-full', 'bg-[#212020]', 'group-hover:bg-black')


        // Handle If tasks is completed
        status.addEventListener('click', function(){
            const TaskID = this.closest('.group').dataset.taskID
            const task = tasks.find(t => t.id === TaskID);

            task.status = !task.status;
            this.closest('.group').dataset.status = task.status;

            if (task.status) {
                this.classList.remove('bg-[#cccccc]');
                this.classList.add('bg-green-300');
              } else {
                this.classList.remove('bg-green-300');
                this.classList.add('bg-[#cccccc]');
              }
              
            savetask()
            console.log(tasks)
            ApplyFilters()
        })


        // task name
        let taskname = document.createElement('input')
        taskname.type = 'text'
        taskname.readOnly = true
        taskname.value = task.name  //takes the name of the task
        taskname.classList.add('cursor-pointer' ,'text-white', 'border', 'border-[#212020]', 'outline-0', 'w-full', 'px-2', 'py-1', 'rounded', 'bg-[#212020]', 'group-hover:bg-black', 'group-hover:border-black')

        taskname.addEventListener('blur', function(){
            if (this.value.trim() === ''){
                this.setCustomValidity('task cannot be empty!')
                this.reportValidity();
                this.focus()
                
            }
            else{ 
                this.setCustomValidity('')
                this.readOnly = true
                this.classList.remove('focus:ring-1', 'focus:ring-green-900')
                
                const taskid = this.closest('.group').dataset.taskID
                tasks = tasks.map(
                    t => t.id === taskid ? {...t, name : this.value.trim()} : t
                )
                savetask()
            }
        })
        taskname.addEventListener('input', function() {
            this.setCustomValidity('')
        })
        taskname.addEventListener('dblclick', function(){
            if(this.readOnly === true){
                this.classList.add('focus:ring-1', 'focus:ring-green-900')
                this.readOnly = false
                this.focus()
                this.setSelectionRange(this.value.length, this.value.length);
             }
        })
        taskname.addEventListener('keydown', function(e){
            if(e.key === 'Enter'){
                console.log('key pressed')
                this.blur()
            }
        })
        let deletebutton = document.createElement('button')
        deletebutton.classList.add('delete-button', 'px-2', 'py-0', 'font-bold', 'text-lg', 'flex', 'items-center', 'text-align', 'rounded-full', 'text-white', 'ml-1', 'group-hover:visible', 'hover:bg-red-900')
        deletebutton.textContent = 'X'

        // check for the id and deletes it from the local data
        deletebutton.addEventListener('click', function(e){
            const taskElement = this.closest('.group');
            const taskID = taskElement.dataset.taskID;
            tasks = tasks.filter(t => t.id !== taskID);
            savetask();
            loadtasks();
        })

    

        
        status.appendChild(inside_status)
        group.appendChild(status)
        group.appendChild(taskname)

        group.appendChild(deletebutton)

        container.appendChild(group)
        


        ApplyFilters()
    }

    document.getElementById('addtask').addEventListener('click', AddTask)


    // adds the task to the local storage and create it's element
    function AddTask(){
        if (!NewTask.value.trim()) {
            NewTask.setCustomValidity('Please enter a task description');
            NewTask.reportValidity();
            return;
        }

        const tasktoadd ={
            id : Date.now().toString(),
            name : NewTask.value.trim(),
            status : false,
        }

        tasks.push(tasktoadd)
        savetask()
        createElementTask(tasktoadd)
        NewTask.value =''
        

    }





// filter handler for fast loading
    incompletedfilter.addEventListener('change', ()=>{
        savefilter()
        ApplyFilters()
    });
    completedfilter.addEventListener('change', ()=>{
        savefilter()
        ApplyFilters()
    });
    loadtasks()
    ApplyFilters();

});