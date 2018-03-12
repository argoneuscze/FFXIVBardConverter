var noteConversion = {
    "a": "y", "b": "u", "c": "q", "d": "w", "e": "e", "f": "r", "g": "t",
    "c#": "2", "d#": "3", "f#": "5", "g#": "6", "a#": "7"
}

function parseNote(note_str) {
    let cur_str = note_str;

    let res = {
        octave: 0,
        extra: ""
    }

    // parse note
    let note = cur_str.charAt(0);
    if (!(note in noteConversion)) {
        return false;
    } else {
        cur_str = cur_str.slice(1);
        res.note = noteConversion[note];
    }

    // check for #
    if (cur_str.length >= 1) {
        if (cur_str.charAt(0) == "#") {
            res.note = noteConversion[note + "#"];
            cur_str = cur_str.slice(1);
        }
    }

    // check for + or - octave
    if (cur_str.length >= 2) {
        if (cur_str.charAt(1) == "1") {
            if (cur_str.charAt(0) == "+") {
                res.octave = 1;
            } else if (cur_str.charAt(0) == "-") {
                res.octave = -1;
            }
        }
        if (res.octave != 0) {
            cur_str = cur_str.slice(2);
        }
    }

    if (cur_str)
        res.extra += cur_str;

    return res;
}

function convertNote(note_str_raw, octave_mod) {
    let note_str = note_str_raw.toLowerCase();
    let res = parseNote(note_str);
    let prefix = "";
    if (!res)
        return "";

    res.octave += octave_mod;

    if (res.octave != 0) {
        res.note = res.note.toUpperCase();
        if (res.octave == 1) {
            prefix = "s";
        } else if (res.octave == -1) {
            prefix = "c";
        } else {
            prefix = "!";
        }
    }

    return prefix + res.note + res.extra;
}

function convertNotes(input, octave_mod) {
    let lines = input.split("\n");
    let line_res = [];
    lines.forEach(function (line) {
        let spl = line.split(" ");
        let res = [];
        spl.forEach(function (note) {
            if (note) {
                let res_note = convertNote(note, octave_mod);
                res_note ? res.push(res_note) : res.push("?");
            }
        });
        line_res.push(res.join(" "));
    });
    return line_res.join("\n");
}

$("#note_button").click(function () {
    let input = $("#note_input").val();
    let octave_mod = parseFloat($("input[name=cv]:checked").val());
    $("#note_output").val(convertNotes(input, octave_mod));
});
