let alumnos=["Miguel","Lucia","Ana","Javier","Laura"];
console.log("lista de alumnos",alumnos);
console.log("numero de alumnos",alumnos.length);
alumnos.push("Carlos");
console.log("lista actualizada de alumnos:",alumnos);
alumnos[6]="Sofia";
console.log("lista final de alumnos:",alumnos);
console.log(alumnos[2]);
console.log(alumnos[-4]);
alumnos[10]="Diego";
console.log("lista con alumno en posicion 10:",alumnos);
console.log(alumnos[8]);
alumnos.pop();
console.log("lista despues de eliminar el ultimo alumno:",alumnos);
alumnos.shift();
console.log("lista despues de eliminar el primer alumno:",alumnos);
for (let i=0;i<alumnos.length;i++){
    console.log("alumno en posicion",i,":",alumnos[i]);
}

let numeros=[1,2,3,4,5,6,7,8,9,10];
console.log(numero[5]);
console.log(alumnos);
let ListaAlumnos=document.getElementById("listaAlumnos");
ListaAlumnos.innerHTML="Lista de alumnos: "+alumnos.join(", ");