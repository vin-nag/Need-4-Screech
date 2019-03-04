
/*
Vector class for engine calculations
*/
class Vector {
    /**
     * @param {int} x x co-ordinate.
     * @param {int} y y co-ordinate.
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    add(vector){
        /*
        this function adds two vectors
        * @param {vector} vector object
         */
        return Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector){
        /*
        this function subtracts two vectors
        * @param {vector} vector object
        */
        return Vector(this.x - vector.x, this.y - vector.y);
    }

    divide(val){
        /*
        this function divides a vector by the given value
        * @param {float} val value
         */
        return Vector(this.x / val, this.y / val);
    }

    multiply(val){
        /*
        this function multiples the vector by the given value
        * @param {float} val value
         */
        return Vector(this.x * val, this.y * val);
    }

    equals(vector){
        /*
        this function determines whether the given vector is equal to the current one
        * @param {vector} vector object
         */
        return (this.x === vector.x && this.y === vector.y);
    }

    dist(vector){
        /*
        this function finds the distance between the given vector and current one
        * @param {vector} vector object
         */
        return Math.sqrt(Math.pow(this.x - vector.x,2) + Math.pow(this.y - vector.y,2));
    }

    normalize(){
        /*
        this function normalize the current vector
         */
        const len = this.length();
        this.x = this.divide(len);
        this.y = this.divide(len);
        return this;
    }

    abs(){
        /*
        this function returns the current vector with absolute values
         */
        return Vector(this.x < 0 ? -1 * this.x : this.x, this.y < 0 ? -1 * this.y: this.y );
    }

    length(){
        /*
        this function gives the length of the current vector
         */
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2) );
    }
}
module.exports = Vector;
