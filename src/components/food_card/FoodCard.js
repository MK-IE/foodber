import React from "react";
import { connect } from "react-redux";
import NavBar from "../nav_bar/NavBar";
import { getRequest } from "../api/FoodApi";
import { SET_OFF_ANIMATION_DURATION } from "../Constant";
import "./style.css";

const image = (imageSrc, classes) => {
    return <img src={imageSrc} className={classes} />;
};

export default class FoodCard extends React.Component {
    state = {
        index: 0,
        nextRecipePage: 0,
        recipeCollection: "",
        onScreenImage: "",
        offScreenImage: "",
    };

    UNSAFE_componentWillMount = () => {
        getRequest(0)
            .then(({ data }) => {
                this.updateState("recipeCollection", data.hits);
                this.updateState(
                    "onScreenImage",
                    this.getImage(0, "image-overlay")
                );
            })
            .catch((error) => console.log(error));
    };

    updateState = (objectName, object, callback = () => {}) =>
        this.setState({ [objectName]: object }, callback);

    timeOut = (method, delay) => setTimeout(method, delay);

    getImage = (index, classes) => {
        const { recipeCollection } = this.state;
        const imageToDisplay = recipeCollection[index].recipe.image;
        return image(imageToDisplay, classes);
    };

    updateOffScreenImage = (index, direction, delay) => {
        this.timeOut(
            () =>
                this.updateState(
                    "offScreenImage",
                    this.getImage(index, `image-overlay move-${direction}`)
                ),
            delay
        );
    };

    swipe = (index, direction) => {
        this.updateState(
            "offScreenImage",
            this.getImage(index, "image-overlay")
        );
        this.updateState(
            "onScreenImage",
            this.getImage(index + 1, "image-overlay")
        );
        this.updateOffScreenImage(index, direction, SET_OFF_ANIMATION_DURATION);
    };

    nextRecipe = (event) => {
        const { index } = this.state;
        this.swipe(index, event.target.name);
        this.updateState("index", index + 1);
    };

    render = () => {
        const { onScreenImage, offScreenImage } = this.state;
        return (
            <div className="p-h-100">
                <div className="center-y">
                    <NavBar />
                </div>
                <div className="food-card-content p-h-80">
                    <div className="overlay-container p-h-80 center-x center-y">
                        {onScreenImage}
                        {offScreenImage}
                        <div className="space-between image-overlay">
                            <button
                                name="left"
                                onClick={this.nextRecipe}
                                className="btn-primary"
                            ></button>
                            <button
                                name="right"
                                onClick={this.nextRecipe}
                                className="btn-danger"
                            ></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}
