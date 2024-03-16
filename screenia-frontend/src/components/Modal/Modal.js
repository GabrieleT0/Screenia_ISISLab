import { useEffect, useState, useMemo } from "react";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import DropdownTreeSelect from "react-dropdown-tree-select";
import 'react-dropdown-tree-select/dist/styles.css';
import { toast } from 'react-toastify';
import { fetchTags, exportComments } from '../../api/opereApi';
import { fetchUsersEditors } from '../../api/userApi';
import Alert from 'react-bootstrap/Alert';
import NumericInput from 'react-numeric-input';

function ExportModal(props) {
    const [editors, setEditors] = useState(null);
    const [selectedEditors, setCheckboxEd] = useState([]);
    const [selectedFormatForm, setFormatForm] = useState(null);
    const [selectedParagraps, setSelectedPar] = useState([]);
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [tagList, setTags] = useState(null);
    const [selectedTags, setSelectedTag] = useState([]);
    const [selectAllEd, setSelectAllEd] = useState(false);
    const [selectAllTags, setSelectAllTags] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [pdfStyle,setPdfStyle] = useState('Courier');
    const [fontSize,setFontSize] = useState(12);

    async function getTags() {
        try {
            const response = await fetchTags();
            let options = [];

            if (response.data && response.data.length > 0) {
                options = [...response.data]
            }
            setTags(options);
        } catch (e) {
            toast.error("Unable to retrieve tags. Contact the administrator!")
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const editorsResponse = await fetchUsersEditors();
                setEditors(editorsResponse.data);
            } catch (error) {
                console.error('Error during the editors fetch', error);
            }
        }
        fetchData();
        getTags();
    }, []);

    const handleSelectedEditors = (value) => {
        setSelectAllEd(false)
        if (selectedEditors.includes(value)) {
            setCheckboxEd((prevSelected) => prevSelected.filter((item) => item !== value));
        } else {
            setCheckboxEd((prevSelected) => [...prevSelected, value]);
        }
    };

    const handleSelectedTags = (value) => {
        setSelectAllTags(false)
        if (selectedTags.includes(value)) {
            setSelectedTag((prevSelected) => prevSelected.filter((item) => item !== value));
        } else {
            setSelectedTag((prevSelected) => [...prevSelected, value]);
        }
    };

    const handleExportFormat = e => {
        if (e.target.value === 'pdf') {
            const export_form = (
                <>
                    <p><b>PDF export options</b></p>
                    <Form.Select aria-label="Style select" onChange={(e) => setPdfStyle(e.currentTarget.value)}>
                        <option>Select font style</option>
                        <option value="Courier">Courier</option>
                        <option value="Courier-Bold">Courier-Bold</option>
                        <option value="Courier-Oblique">Courier-Oblique</option>
                        <option value="Courier-BoldOblique">Courier-BoldOblique</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Helvetica-Bold">Helvetica-Bold</option>
                        <option value="Helvetica-Oblique">Helvetica-Oblique</option>
                        <option value="Helvetica-BoldOblique">Helvetica-BoldOblique</option>
                        <option value="Symbol">Symbol</option>
                        <option value="Times-Roman">Times-Roman</option>
                        <option value="Times-Bold">Times-Bold</option>
                        <option value="Times-Italic">Times-Italic</option>
                        <option value="Times-BoldItalic">Times-BoldItalic</option>
                        <option value="ZapfDingbats">ZapfDingbats</option>
                    </Form.Select>
                    <p>Font size:</p>
                    <NumericInput min={5} max={50} value={12} onChange={(e) => setFontSize(e)}/>
                </>
            )
            setFormatForm(export_form)
            setSelectedFormat(e.target.value)
        } else if (e.target.value === 'epub') {
            const export_form = (
                <>
                    <p><b>EPUB export options</b></p>
                    <Form.Select aria-label="Style select" onChange={(e) => setPdfStyle(e.currentTarget.value)}>
                        <option>Select font style</option>
                        <option value="Courier">Courier</option>
                        <option value="Courier-Bold">Courier-Bold</option>
                        <option value="Courier-Oblique">Courier-Oblique</option>
                        <option value="Courier-BoldOblique">Courier-BoldOblique</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Helvetica-Bold">Helvetica-Bold</option>
                        <option value="Helvetica-Oblique">Helvetica-Oblique</option>
                        <option value="Helvetica-BoldOblique">Helvetica-BoldOblique</option>
                        <option value="Symbol">Symbol</option>
                        <option value="Times-Roman">Times-Roman</option>
                        <option value="Times-Bold">Times-Bold</option>
                        <option value="Times-Italic">Times-Italic</option>
                        <option value="Times-BoldItalic">Times-BoldItalic</option>
                        <option value="ZapfDingbats">ZapfDingbats</option>
                    </Form.Select>
                    <p>Font size:</p>
                    <NumericInput min={5} max={50} value={12} onChange={(e) => setFontSize(e)}/>
                </>
            )
            setFormatForm(export_form)
            setSelectedFormat(e.target.value)
        }
    }

    async function fetchCommentAndPar(postData,operaId){
        try {
            const commentsResponse = await exportComments(postData,operaId);
            return commentsResponse
        } catch (error) {
            console.error('Error during the comments fetch', error);
        }
    }

    const DropDownTreeSelect = useMemo(() => {
        return (
          <DropdownTreeSelect
            data={props.data}
            onChange={(currentNode, selectedNodes) => {
              setSelectedPar(selectedNodes)
            }}
            texts={{ placeholder: "Select paragraphs" }}
            className="dropSelect"
          />
        )
      }, [props.data])
    
    const handleSendForm = (props) => {
        let error_message = ''
        setErrorMessage(null)

        if(!selectedFormat){
            error_message += '\n Format not selected'
        } else if (selectedFormat === 'pdf'){
        }
        if(selectedEditors.length === 0){
            error_message += '\n Select at least one editors'
        }
        if(selectedTags.length === 0){
            error_message += '\n Select at least one tag'
        }
        if(selectedParagraps.length === 0){
            error_message += '\n Select at least one paragraph'
        }
        if(error_message !== ''){
            let error_alert =(        
                <Alert key={'error_form'} variant={'danger'}>{error_message}</Alert>
                )
            setErrorMessage(error_alert)
            return
        }
        let request_data = {}
        switch(selectedFormat){
            case 'pdf':
                request_data = {
                    format: selectedFormat,
                    editors: selectedEditors,
                    tags: selectedTags,
                    paragraphs: selectedParagraps,
                    font_size: fontSize,
                    font_family: pdfStyle
                }
            break;

            case 'epub':
                request_data = {
                    format: selectedFormat,
                    editors: selectedEditors,
                    tags: selectedTags,
                    paragraphs: selectedParagraps,
                    font_size: fontSize,
                    font_family: pdfStyle
                }
            break

            default:
                request_data = {
                    format: selectedFormat,
                    editors: selectedEditors,
                    tags: selectedTags,
                    paragraphs: selectedParagraps
                }
        }

        fetchCommentAndPar(request_data,props.idOpera).then(
            response =>{
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                let response_format = response.headers['content-type'].split('/')[1]
                if(response_format === 'octet-stream'){
                    link.download = `exported_comments.epub`;
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        )

    }

    const handleSelectAllEd = () => {
        if (!selectAllEd) {
            setSelectAllEd(true)
            setCheckboxEd(editors.map(editor => editor.email))
        } else {
            setCheckboxEd([])
            setSelectAllEd(false)
        }
    }

    const handleSelectAllTags = () => {
        if (!selectAllTags) {
            setSelectAllTags(true)
            setSelectedTag(tagList.map(tag => tag.title))
        } else {
            setSelectedTag([])
            setSelectAllTags(false)
        }
    }

    return (

        <Modal {...props} size="lg" className='modal'>
            <Modal.Header closeButton>
                <Modal.Title>Export comments</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage}
                <Container>
                    <Row>
                        <Col md={4}>
                            {DropDownTreeSelect}
                        </Col>
                        <Col md={2}>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-editors">
                                    Editors
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Form.Check
                                        key={'allEd'}
                                        className="editor-checkboxes"
                                        label={'Select All'}
                                        name="Group1"
                                        type="checkbox"
                                        id="allEd"
                                        onChange={() => handleSelectAllEd()}
                                        checked={selectAllEd}
                                    />
                                    {editors && editors.map((editor) => (
                                        <Form.Check
                                            key={editor.id}
                                            className="editor-checkboxes"
                                            label={editor.email}
                                            name="Group1"
                                            type="checkbox"
                                            id={editor.email}
                                            onChange={() => handleSelectedEditors(editor.email)}
                                            checked={selectedEditors.includes(editor.email)}
                                        />
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col md={1}>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-tags">
                                    Tags
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Form.Check
                                        key={'allTags'}
                                        className="tag-checkboxes"
                                        label={'Select All'}
                                        name="Group2"
                                        type="checkbox"
                                        id="allTags"
                                        onChange={() => handleSelectAllTags()}
                                        checked={selectAllTags}
                                    />
                                    {tagList && tagList.map((tag) => (
                                        <Form.Check
                                            key={tag.title}
                                            className="tag-checkboxes"
                                            label={`${tag.title} (${tag.category})`}
                                            name="Group2"
                                            type="checkbox"
                                            id={tag.title}
                                            onChange={() => handleSelectedTags(tag.title)}
                                            checked={selectedTags.includes(tag.title)}
                                        />
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label className="export-title">Export formats:</Form.Label>
                        <Form.Check
                            inline
                            required
                            name="formats-group"
                            type="radio"
                            label=".pdf"
                            id="pdf-export"
                            value="pdf"
                            onChange={handleExportFormat}
                        />
                        <Form.Check
                            inline
                            name="formats-group"
                            type="radio"
                            label=".epub"
                            id="epub-export"
                            value="epub"
                            onChange={handleExportFormat}
                        />
                    </Form.Group>
                    {selectedFormatForm}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSendForm(props)}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal >
    )
}

export default ExportModal;